import {
  BadRequestException,
  Controller,
  HttpException,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { randomBytes } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { rateLimit } from "../../common/utils/rate-limit";
import { ipHashFromRequest } from "../../common/utils/server-hash";

const UPLOAD_DIR = "uploads";
const ALLOWED = /\.(jpe?g|png|webp|gif)$/i;

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const name = randomBytes(12).toString("hex");
    cb(null, `${name}${extname(file.originalname).toLowerCase()}`);
  },
});

const interceptor = () =>
  FileInterceptor("file", {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => cb(null, ALLOWED.test(file.originalname)),
  });

function toResponse(file?: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException(
      "File tidak valid (jpg/png/webp/gif, maks 5MB).",
    );
  }
  return { ok: true, url: `/uploads/${file.filename}` };
}

/** Replaces Supabase Storage: images land in ./uploads, served at /uploads/*. */
@Controller()
export class UploadsController {
  /** Authenticated upload (admin & participant photos, quest ref images). */
  @Post("upload")
  @UseGuards(JwtGuard)
  @UseInterceptors(interceptor())
  upload(@UploadedFile() file?: Express.Multer.File) {
    return toResponse(file);
  }

  /** Anonymous voter proof upload — rate-limited per IP instead of auth. */
  @Post("upload-proof")
  @UseInterceptors(interceptor())
  uploadProof(@Req() req: Request, @UploadedFile() file?: Express.Multer.File) {
    const ipKey = ipHashFromRequest(req) ?? "noip";
    if (!rateLimit(`upload:${ipKey}`, 30, 60_000)) {
      throw new HttpException(
        { error: "Terlalu banyak unggahan. Coba lagi sebentar." },
        429,
      );
    }
    return toResponse(file);
  }
}

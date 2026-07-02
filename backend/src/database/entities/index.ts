export { School } from "./school.entity";
export { Participant, type ParticipantStatus } from "./participant.entity";
export { Profile, type Role } from "./profile.entity";
export { DailyVote, type VoteKind } from "./daily-vote.entity";

import { School } from "./school.entity";
import { Participant } from "./participant.entity";
import { Profile } from "./profile.entity";
import { DailyVote } from "./daily-vote.entity";

/** Single registration point — add new entities here once. */
export const ENTITIES = [School, Participant, Profile, DailyVote];

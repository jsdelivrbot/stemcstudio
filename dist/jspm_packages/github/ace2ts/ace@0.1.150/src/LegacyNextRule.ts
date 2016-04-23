import Rule from './Rule';
/**
 *
 */
interface LegacyNextRule {
  token: string[];
  regex: string;
  next: Rule[];
}

export default LegacyNextRule;

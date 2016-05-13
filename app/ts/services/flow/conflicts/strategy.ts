import activationRecency from './activationRecency';
import bucketCounter from './bucketCounter';
import factRecency from './factRecency';
import salience from './salience';
import Match from '../Match';
import ConflictResolutionStrategy from '../ConflictResolutionStrategy';

const strategies: { [name: string]: ConflictResolutionStrategy<any> } = {
    salience: salience,
    bucketCounter: bucketCounter,
    factRecency: factRecency,
    activationRecency: activationRecency
};

export default function strategy<T>(strategyNames: string[]) {
    const strats = strategyNames.map(function(name) { return strategies[name]; });
    const stratsLength = strats.length;

    return function(a: Match<T>, b: Match<T>) {
        let i = -1;
        let ret = 0;
        const equal = (a === b) || (a.name === b.name && a.hashCode === b.hashCode);
        if (!equal) {
            while (++i < stratsLength && !ret) {
                ret = strats[i](a, b);
            }
            ret = ret > 0 ? 1 : -1;
        }
        return ret;
    };
}

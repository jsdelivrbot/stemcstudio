import * as angular from 'angular';

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs an AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform an OR.
 */
function propsFilter<T>() {
    return function(items: T[], props: { [name: string]: string }) {

        if (angular.isArray(items)) {
            const out: T[] = [];
            const keys = Object.keys(props);

            items.forEach(function(item) {
                let itemMatches = false;

                for (let i = 0; i < keys.length; i++) {
                    const prop = keys[i];
                    const text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
            return out;
        }
        else {
            // Let the output be the input untouched
            return items;
        }
    };
}

propsFilter['$inject'] = [];

export default propsFilter;

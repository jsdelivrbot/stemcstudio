import { dedent } from './dedent';
import Snippet from '../Snippet';

const snippets: Snippet[] = [
    {
        tabTrigger: "ife",
        name: "ife",
        content: dedent`
        if (\${1:true}) {
            \${2}
        }
        else {
            \${0}
        }`
    }
];
export default snippets;

import { Delta } from 'editor-document';
import { EditSessionEvent } from './EditSessionEvent';

export interface EditSessionChangEvent extends EditSessionEvent<Delta> {

}

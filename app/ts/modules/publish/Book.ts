import Chapter from './Chapter';
import Titled from './Titled';

interface Book extends Titled<Chapter> {
}

export default Book;

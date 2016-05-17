import Book from './Book';
import Titled from './Titled';

interface Category extends Titled<Book> {
}

export default Category;

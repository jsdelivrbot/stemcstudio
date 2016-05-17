import Category from './Category';
import Book from './Book';
import Chapter from './Chapter';
import Topic from './Topic';
import Level from './Level';
import PublishSettings from './PublishSettings';

interface PublishModalScope {

    categories: Category[];
    categoriesEnabled: boolean;
    onCategorySelect(category: Category, model: string): void;

    books: Book[];
    booksEnabled: boolean;
    onBookSelect(book: Book, model: string): void;

    levels: Level[];

    chapters: Chapter[];
    chaptersEnabled: boolean;
    onChapterSelect(chapter: Chapter, model: string): void;

    topics: Topic[];
    topicsEnabled: boolean;
    onTopicSelect(topic: Topic, model: string): void;

    selected: { category: Category; book: Book; chapter: Chapter; topic: Topic };


    options: PublishSettings;
    ok(): void;
    cancel(); void;
}

export default PublishModalScope;

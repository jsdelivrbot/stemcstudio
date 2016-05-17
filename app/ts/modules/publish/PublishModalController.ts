import * as uib from 'angular-bootstrap';
import Category from './Category';
import Book from './Book';
import Chapter from './Chapter';
import Topic from './Topic';
import PublishModalScope from './PublishModalScope';
import PublishSettings from './PublishSettings';
import mathematics from './mathematics/category';
import physics from './physics/category';
import compsci from './compsci/category';

export default class PublishModalController {
    public static $inject: string[] = ['$scope', '$uibModalInstance', 'options'];
    constructor($scope: PublishModalScope, $uibModalInstance: uib.IModalServiceInstance, options: PublishSettings) {
        $scope.options = options;

        $scope.ok = function() {
            $uibModalInstance.close($scope.options);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel click');
        };

        $scope.selected = { category: void 0, book: void 0, chapter: void 0, topic: void 0 };

        $scope.categories = [
            mathematics,
            physics,
            compsci
        ];

        $scope.categoriesEnabled = true;
        $scope.onCategorySelect = (category: Category, model: string): void => {
            if (category !== $scope.selected.category) {
                $scope.books = category.parts;
                $scope.selected.category = category;
                $scope.selected.book = void 0;
                $scope.selected.chapter = void 0;
                $scope.selected.topic = void 0;
            }
        }

        $scope.books = [];
        $scope.booksEnabled = true;
        $scope.onBookSelect = (book: Book, model: string): void => {
            if (book !== $scope.selected.book) {
                $scope.chapters = book.parts;
                $scope.selected.book = book;
                $scope.selected.chapter = void 0;
                $scope.selected.topic = void 0;
            }
        }

        $scope.chapters = []
        $scope.chaptersEnabled = true;
        $scope.onChapterSelect = (chapter: Chapter, model: string): void => {
            if (chapter !== $scope.selected.chapter) {
                $scope.topics = chapter.parts;
                $scope.selected.chapter = chapter;
                $scope.selected.topic = void 0;
            }
        }

        $scope.topicsEnabled = true;
        $scope.onTopicSelect = (topic: Topic, model: string): void => {
            if (topic !== $scope.selected.topic) {
                $scope.selected.topic = topic;
            }
        }

        $scope.levels = [
            {
                value: 10,
                name: 'Graduate'
            },
            {
                value: 7,
                name: 'Undergraduate'
            },
            {
                value: 4,
                name: 'High School'
            },
            {
                value: 1,
                name: 'Middle School'
            }
        ];
    }
}
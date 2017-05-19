export type Category =
    'Chemistry'
    | 'CompSci'
    | 'Graphics'
    | 'Mathematics'
    | 'Physics'
    | 'Programming'
    | 'Visualization';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface Example {
    gistId: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    category: Category;
    level: Level;
}

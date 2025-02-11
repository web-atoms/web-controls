export interface IPostSearchResult {
    posts: [{
        id: number;
        title: string;
        reactions: number;
        userId: number;
        tags: string[];
    }],
    total: number;
    skip: number;
    limit: number;
}

export type IPost = IPostSearchResult["posts"][0];

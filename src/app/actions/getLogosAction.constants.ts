export const LOGOS_PAGE_SIZE = 20; // 每次加载的数量

export type LogoListFilter = {
  nationCode?: string;
  subjectType?: 'club' | 'comp' | 'team' | 'assn' | 'conf';
};

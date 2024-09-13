export type Tag = string;

export type CardData<T extends Tag> = {
  id: string;
  img: string;
  title: string;
  description: string;
  chapters: number;
  duration: string;
  price: number;
  enrolled?: boolean;
  tags: T[];
};

export type LiveCardData<T extends Tag> = {
  id: string;
  img: string;
  title: string;
  watching: number;
  tags: T[];
};

export type Section = {
  id: string;
  title: string;
};

export type Module = {
  id: string;
  title: string;
  sections: Section[];
};

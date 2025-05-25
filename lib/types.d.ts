interface News {
  title: string;
  content: string;
  source: string;
}
interface Terms {
  title: string;
  text?: stirng;
  content: {
    subtitle1: string;
    list: {
      listTitle: string;
      subList: string[];
    }[];
    subtitle2: string;
  }[];
}
interface News {
  title: string;
  content: string;
  source: string;
  createdAt?: Date;
}
interface UserResp {
  id: number;
  first_name: string;
  last_name: string;
  photo_url: string;
  username: string;
}
interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  userName: string;
}

import { URL } from "url";

export function urlToPath(url: string): string {
  const path = new URL(url).pathname;
  if (process.platform === "win32") {
    return decodeURIComponent(path.substring(1, path.length));
  } else {
    return decodeURIComponent(path);
  }
}

export function removeDuplicatesBy(keyFn: Function, array: any[]): any[] {
  let mySet = new Set();
  return array.filter(function(x: any) {
    let key = keyFn(x);
    let isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

export function array_move(arr: any[], old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

function getRandomIndex(list: any[]) {
  return Math.floor(Math.random()*list.length)
}

export function getRandomListItem(list: any[], count: number = 1) {
  if (count <= 0) {
    return;
  } else if (count == 1) {
    return list[getRandomIndex(list)];
  } else {
    let newList = [];
    for (let c = 0; c < count && list.length > 0; c++) {
      newList.push(list.splice(getRandomIndex(list),1)[0])
    }
    return newList;
  }
}

// Inspired by https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export class CancelablePromise extends Promise<Array<string>> {
  hasCanceled: boolean;
  // Only looping sources use these properties
  source: string;
  index: number;
  page: number;
  timeout: number;


  constructor(executor: (resolve: (value?: (PromiseLike<Array<string>> | Array<string>)) => void, reject: (reason?: any) => void) => void) {
    super(executor);
    this.hasCanceled = false;
    this.source = "";
    this.index = 0;
    this.page = 0;
    this.timeout = 0;
  }

  getPromise(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.then(
          val => this.hasCanceled ? null : resolve(val),
          error => this.hasCanceled ? null : reject(error)
      );
    });
  }

  cancel() {
    this.hasCanceled = true;
  }
}
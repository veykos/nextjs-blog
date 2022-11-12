import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // get file names under /posts
  const filenames = fs.readdirSync(postsDirectory)
  const allPostsData = filenames.map(filename => {
    // remove .md from file name to get id;
    const id = filename.replace(/\.md$/ , '');

    //read markdown file as string
    const fullPath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // use gray matter to parse the post metadata section;

    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data,
    };
  })
  return allPostsData.sort(({date: a}, {date: b}) => {
    if (a<b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostsIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => {
    return {
      params : {
        id: fileName.replace(/\.md$/, ''),
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
  .use(html)
  .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}
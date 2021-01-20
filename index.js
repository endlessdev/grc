#!/usr/bin/env node
const commander = require('commander');
const templates = require('./templates');
const fs = require('fs');
const shell = require('shelljs')
const _ = require('lodash');

const TEMPLATE_REPOSITORY_URL = 'https://github.com/goodoc/goodoc-fe-template.git';

const getComponentTargetPath = (componentType, name) => {
  const currentPath = process.cwd();
  return `${currentPath}/components/${componentType}/${name}`;
}

const generateComponentFiles = (type, name) => {
  const modelName = _.chain(name).camelCase().capitalize().value();
  const path = getComponentTargetPath(type, modelName);
  if (fs.existsSync(path)) {
    console.error(`${path} is already exist!`)
    return
  }
  fs.mkdirSync(`${path}`)
  fs.writeFileSync(`${path}/index.tsx`, templates.component(modelName))
  fs.writeFileSync(`${path}/${modelName}.stories.tsx`, templates.story(modelName))
  fs.writeFileSync(`${path}/${modelName}.spec.tsx`, templates.jest(modelName))
  fs.writeFileSync(`${path}/style.ts`, templates.styled)
}

const actions = {
  create: (path) => {
    if (fs.existsSync(path)) {
      console.error('Already exist path!')
      return
    }

    try {
      shell.exec(`git clone ${TEMPLATE_REPOSITORY_URL} ${path}`)
      console.log('Template 가져오기 완료!')
      console.log('외부 라이브러리를 설치합니다.')
      shell.exec(`cd ${path} && pwd && yarn install`)
      console.log('설치 완료!')
      console.log(`${process.cwd()}/${path} 디렉토리안에서, 다음과 같은 명령어를 실행하실 수 있습니다.`)
      console.log('')
      console.log('  yarn dev')
      console.log('    로컬 개발서버를 실행시킵니다.')
      console.log('')
      console.log('  yarn test')
      console.log('    컴포넌트 유닛테스트를 실행합니다.')
      console.log('')
      console.log('  yarn storybook')
      console.log('    스토리북을 통해 컴포넌트별로 렌더된 화면을 확인할 수 있습니다.')
      console.log('')
      console.log('----------------------------------------')
      console.log('간단한 샘플코드가 포함되어 있으니 참고하셔도 좋아요.')
      console.log('grc help에서 편하게 사용할 수 있는 명령어들을 확인하세요. 이 명령어들은 프로젝트 내부 루트경로에서 사용해주세요.')
      console.log('즐코딩! 굿닥몬 화이팅!')
    } catch (e) {
      console.error(e);
    }
  },
  at: (name) => {
    generateComponentFiles('atoms', name)
  },
  mo: (name) => {
    generateComponentFiles('mocules', name)
  },
  or: (name) => {
    generateComponentFiles('organisms', name)
  },
  te: (name) => {
    generateComponentFiles('templates', name)
  },
  pg: (name) => {
    const currentPath = process.cwd();
    const pagePath = `${currentPath}/pages/${name}`
    const styledPath = `${currentPath}/components/page-styles/${name}.ts`
    const modelName = _.chain(name).camelCase().capitalize().value();
    if (fs.existsSync(pagePath)) {
      console.error(`${pagePath} is already exist!`)
      return
    }
    fs.mkdirSync(`${pagePath}`)
    fs.writeFileSync(`${pagePath}/index.tsx`, templates.page(name, modelName))
    fs.writeFileSync(`${styledPath}`, templates.styled)
  },
  help: () => {
    console.log('grc create ${name}')
    console.log('  현재위치에서 입력한 name 경로로 템플릿을 생성합니다.')
    console.log('---------------')
    console.log('grc at ${name}')
    console.log('  atom 컴포넌트를 생성합니다.')
    console.log('---------------')
    console.log('grc mo ${name}')
    console.log('  mocules 컴포넌트를 생성합니다.')
    console.log('---------------')
    console.log('grc or ${name}')
    console.log('  organisms 컴포넌트를 생성합니다.')
    console.log('---------------')
    console.log('grc te ${name}')
    console.log('  template 컴포넌트를 생성합니다.')
    console.log('grc pg ${name}')
    console.log('  page 및 page 컴포넌트를 생성합니다.')
  }

}

commander
  .arguments("<action> [target]")
  .action(function(action, target) {
    const selectedAction = actions[action];
    selectedAction(target);
  })
  .parse(process.argv);
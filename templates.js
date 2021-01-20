const component = (name) => `import React from 'react';
import $ from './style';

type Props = {
};

export default function ${name}({}: Props) {
  return <$.Container />;
}
`

const styled = `import styled from 'styled-components';

const Container = styled.div\`

\`;

export default {
  Container,
};
`

const story = (name) => `import React from 'react';
import ${name} from './index';

export default {
  title: '${name}',
  component: ${name}
}

export const Basic = () => (
  <${name} />
)
`

const jest = (name) => `import React from 'react';
import { shllow } from 'enzyme';
import ${name} from './index';

describe('${name} Test', () => {
  it('${name} 컴포넌트가 정상적으로 렌더되어야 한다.', () => {
    const component = shallow(
      <${name} />,
    );
    expect(component).toMatchSnapshot();
  });
});
`

const page = (name, modelName) => `import React from 'react';
import $ from 'components/page-styles/${name}';

export default function ${modelName}() {
  return (
    <$.Container>

    </$.Container>
  );
}
`

module.exports = {
  component,
  styled,
  story,
  jest,
  page,
}
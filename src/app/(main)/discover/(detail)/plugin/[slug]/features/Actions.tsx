'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { DiscoverPlugintem } from '@/types/discover';

import InstallTool from './InstallPlugin';

interface PluginActionsProps extends FlexboxProps {
  data: DiscoverPlugintem;
  identifier: string;
}

const PluginActions = memo<PluginActionsProps>(({ identifier }) => {
  return (
    <Flexbox align={'center'} gap={8} horizontal>
      <InstallTool identifier={identifier} />
    </Flexbox>
  );
});

export default PluginActions;

'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { DiscoverAssistantItem } from '@/types/discover';

import AddAgent from './AddAgent';

interface AssistantActionProps extends FlexboxProps {
  data: DiscoverAssistantItem;
  identifier: string;
}

const AssistantAction = memo<AssistantActionProps>(({ data }) => {
  return (
    <Flexbox align={'center'} gap={8} horizontal>
      <AddAgent data={data} />
    </Flexbox>
  );
});

export default AssistantAction;

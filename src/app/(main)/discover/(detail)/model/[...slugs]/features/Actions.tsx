'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { DiscoverModelItem, DiscoverProviderItem } from '@/types/discover';

import ChatWithModel from './ChatWithModel';

interface ModelActionsProps extends FlexboxProps {
  data: DiscoverModelItem;
  identifier: string;
  providerData: DiscoverProviderItem[];
}

const ModelActions = memo<ModelActionsProps>(({ providerData, data }) => {
  return (
    <Flexbox align={'center'} gap={8} horizontal>
      <ChatWithModel providerData={providerData} providers={data.providers} />
    </Flexbox>
  );
});

export default ModelActions;

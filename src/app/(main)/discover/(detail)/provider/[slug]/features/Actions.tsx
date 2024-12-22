'use client';

import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { DiscoverProviderItem } from '@/types/discover';

import ProviderConfig from './ProviderConfig';

interface ModelActionsProps extends FlexboxProps {
  data: DiscoverProviderItem;
  identifier: string;
}

const ProviderActions = memo<ModelActionsProps>(({ identifier, data }) => {
  return (
    <Flexbox align={'center'} gap={8} horizontal width={'100%'}>
      <ProviderConfig data={data} identifier={identifier} />
    </Flexbox>
  );
});

export default ProviderActions;

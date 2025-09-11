import { Checkbox, CheckboxProps } from '@chakra-ui/react';
import { PropsWithChildren, memo } from 'react';

interface Props extends PropsWithChildren, CheckboxProps {
  value: string | number;
}

const CheckboxItem = memo(({ value, children, ...rest }: Props) => {
  return (
    <Checkbox key={rest.key} size="sm" value={value} {...rest}>
      {children}
    </Checkbox>
  );
});

CheckboxItem.displayName = 'CheckboxItem';

export default CheckboxItem;

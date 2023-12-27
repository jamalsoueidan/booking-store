import {Modal, type ModalProps} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

export default function MobileModal({children, ...props}: ModalProps) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  return (
    <Modal fullScreen={isMobile} withCloseButton centered {...props}>
      {children}
    </Modal>
  );
}

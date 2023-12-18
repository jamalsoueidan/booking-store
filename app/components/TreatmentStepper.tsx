import {
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';

import {
  ActionIcon,
  Box,
  Button,
  Group,
  Text,
  Tooltip,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {type ReactNode} from 'react';
import {determineStepFromURL} from '~/lib/determineStepFromURL';

type PathFragment = {
  title: string;
  path: string;
  required?: Array<string>;
  text?: string;
};

type StepperProps = {
  paths: PathFragment[];
};

export function TreatmentStepper({paths}: StepperProps) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const nextStep = () => {
    const path = paths[determineStepFromURL(paths, location.pathname) + 1];
    navigate(path.path + location.search, {
      state: {
        key: 'booking',
      },
    });
  };

  const prevStep = () => {
    const path = paths[determineStepFromURL(paths, location.pathname) - 1];
    if (path.path === '') {
      return navigate('./', {
        state: {
          key: 'booking',
        },
      });
    }
    navigate(path.path + location.search, {
      state: {
        key: 'booking',
      },
    });
  };

  const currenctActive = determineStepFromURL(paths, location.pathname);
  const currentPath = paths[currenctActive];

  const requiredParams = currentPath.required;
  const missingParams = requiredParams?.filter(
    (param) => !searchParams.has(param),
  );

  const disabled = (missingParams && missingParams.length > 0) || false;

  return (
    <Box
      hidden={currentPath.path === 'completed'}
      id="stepper"
      pos="sticky"
      bottom="0px"
      bg="white"
      p={isMobile ? 'md' : 'lg'}
      style={{boxShadow: '0 -4px 4px rgba(0,0,0,.1)'}}
    >
      <Group justify="space-between">
        <Group gap="xs">
          {currenctActive > 0 ? (
            <>
              <Text c="dimmed" size={rem(isMobile ? 16 : 20)}>
                {currenctActive}/{Object.keys(paths).length - 1}
              </Text>
              <Text fw={500} tt="uppercase" size={rem(isMobile ? 16 : 20)}>
                {currentPath.title}
              </Text>
            </>
          ) : null}
        </Group>
        {currentPath.path !== 'completed' && (
          <Group gap="xs">
            {currenctActive > 0 ? (
              <>
                <ActionIcon
                  variant="filled"
                  color="black"
                  radius={isMobile ? 'lg' : 'xl'}
                  size={isMobile ? 'lg' : 'xl'}
                  aria-label="Tilbage"
                  onClick={prevStep}
                  loading={navigation.state === 'loading'}
                >
                  <IconArrowLeft stroke={1.5} />
                </ActionIcon>

                <ConditionalTooltip
                  disabled={disabled}
                  tooltipText={currentPath.text}
                >
                  <ActionIcon
                    variant="filled"
                    color="black"
                    radius={isMobile ? 'lg' : 'xl'}
                    size={isMobile ? 'lg' : 'xl'}
                    aria-label="Næste"
                    onClick={nextStep}
                    disabled={disabled}
                    loading={navigation.state === 'loading'}
                  >
                    <IconArrowRight stroke={1.5} />
                  </ActionIcon>
                </ConditionalTooltip>
              </>
            ) : (
              <Button
                variant="filled"
                color="black"
                size="md"
                rightSection={<IconArrowRight />}
                onClick={nextStep}
              >
                Bestil tid
              </Button>
            )}
          </Group>
        )}
      </Group>
    </Box>
  );
}

type ConditionalTooltipProps = {
  children: ReactNode;
  disabled: boolean;
  tooltipText?: string;
};

const ConditionalTooltip: React.FC<ConditionalTooltipProps> = ({
  children,
  disabled,
  tooltipText,
}) => {
  if (disabled) {
    return (
      <Tooltip label={tooltipText} color="red">
        {children}
      </Tooltip>
    );
  }

  return <>{children}</>;
};

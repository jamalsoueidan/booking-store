import {
  Outlet,
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
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {type ReactNode} from 'react';
import {type ProductFragment} from 'storefrontapi.generated';
import {determineStepFromURL} from '~/lib/determineStepFromURL';

type PathFragment = {
  title: string;
  path: string;
  required?: Array<string>;
  text?: string;
};

type StepperProps = {
  paths: PathFragment[];
  product: ProductFragment;
};

export function TreatmentStepper({paths, product}: StepperProps) {
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
    <>
      <Group justify="space-between">
        <Group gap="xs">
          <Text c="dimmed" size={rem(20)}>
            {currenctActive + 1}/{Object.keys(paths).length}
          </Text>
          <Text fw={500} tt="uppercase" size={rem(20)}>
            {currentPath.title}
          </Text>
        </Group>
        {currentPath.path !== 'completed' && (
          <Group gap="xs">
            {currenctActive > 0 ? (
              <>
                <ActionIcon
                  variant="filled"
                  color="yellow"
                  c="black"
                  radius="xl"
                  size="xl"
                  aria-label="Tilbage"
                  onClick={prevStep}
                  loading={navigation.state === 'loading'}
                >
                  <IconArrowLeft
                    style={{width: '70%', height: '70%'}}
                    stroke={1.5}
                  />
                </ActionIcon>

                <ConditionalTooltip
                  disabled={disabled}
                  tooltipText={currentPath.text}
                >
                  <ActionIcon
                    variant="filled"
                    color="yellow"
                    c="black"
                    radius="xl"
                    size="xl"
                    aria-label="Næste"
                    onClick={nextStep}
                    disabled={disabled}
                    loading={navigation.state === 'loading'}
                  >
                    <IconArrowRight
                      style={{width: '70%', height: '70%'}}
                      stroke={1.5}
                    />
                  </ActionIcon>
                </ConditionalTooltip>
              </>
            ) : (
              <Button
                variant="filled"
                color="yellow"
                c="black"
                radius="xl"
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

      <Box mt="xl">
        <Outlet context={{product}} />
      </Box>
    </>
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

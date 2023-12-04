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
  ScrollArea,
  Text,
  Tooltip,
  rem,
} from '@mantine/core';
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {useEffect, useState, type ReactNode} from 'react';
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
  const [disabled, setDisabled] = useState(false);
  const navigation = useNavigation();

  const [active, setActive] = useState(
    determineStepFromURL(paths, location.pathname),
  );

  const nextStep = () => {
    const newActive = active < 5 ? active + 1 : active;
    setActive(newActive);
    navigate(paths[newActive].path + location.search, {
      state: {
        key: 'booking',
      },
    });
  };

  const prevStep = () => {
    const newActive = active > 0 ? active - 1 : active;
    setActive(newActive);
    if (newActive === 0) {
      return navigate('./', {
        state: {
          key: 'booking',
        },
      });
    }
    navigate(paths[newActive].path + location.search, {
      state: {
        key: 'booking',
      },
    });
  };

  useEffect(() => {
    const requiredParams = paths[active].required;
    if (requiredParams) {
      const missingParams = requiredParams.filter(
        (param) => !searchParams.has(param),
      );
      return setDisabled(missingParams.length > 0);
    }
    setDisabled(false);
  }, [active, paths, searchParams]);

  return (
    <>
      <Group justify="space-between">
        <Group gap="xs">
          <Text c="dimmed" size={rem(24)}>
            {active + 1}/{Object.keys(paths).length}
          </Text>
          <Text fw={500} tt="uppercase" size={rem(24)}>
            {paths[active].title}
          </Text>
        </Group>
        {paths[active].path !== 'completed' && (
          <Group gap="xs">
            {active > 0 ? (
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
                  tooltipText={paths[active].text}
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
                Bestil en tid
              </Button>
            )}
          </Group>
        )}
      </Group>

      <Box mt="xl">
        {paths[active].path === 'completed' ||
        paths[active].path === 'pick-datetime' ? (
          <Outlet context={{product}} />
        ) : (
          <ScrollArea
            style={{height: 'calc(100vh)'}}
            type="always"
            offsetScrollbars
            scrollbarSize={18}
          >
            <Outlet context={{product}} />
          </ScrollArea>
        )}
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

// Usage remains the same

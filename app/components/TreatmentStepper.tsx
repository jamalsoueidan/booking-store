import {
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';

import {ActionIcon, Button, Group, Text, Tooltip} from '@mantine/core';
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {type ReactNode} from 'react';
import {determineStepFromURL} from '~/lib/determineStepFromURL';

const paths = [
  {
    title: '',
    path: '',
  },
  {
    title: 'Lokation',
    path: 'pick-location',
    required: ['locationId'],
    text: 'Vælge en lokation før du kan forsætte...',
  },
  {
    title: 'Flere behandlinger',
    path: 'pick-more',
  },
  {
    title: 'Dato & Tid',
    path: 'pick-datetime',
    required: ['fromDate', 'toDate'],
    text: 'Vælge en tid før du kan forsætte...',
  },
  {
    title: 'Køb',
    path: 'completed',
  },
];

export function TreatmentStepper() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const nextStep = () => {
    const path = paths[determineStepFromURL(paths, location.pathname) + 1];
    navigate(`../${path.path}${location.search}`, {
      state: {
        key: 'booking',
      },
    });
  };

  const prevStep = () => {
    const path = paths[determineStepFromURL(paths, location.pathname) - 1];
    if (path.path === '') {
      return navigate('../', {
        state: {
          key: 'booking',
        },
      });
    }
    navigate(`../${path.path}${location.search}`, {
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
    <Group justify="space-between">
      <Group gap="xs">
        {currenctActive > 0 ? (
          <>
            <Text c="dimmed" fz={{base: 16, sm: 20}}>
              {currenctActive}/{Object.keys(paths).length - 1}
            </Text>
            <Text fw={500} tt="uppercase" fz={{base: 16, sm: 20}}>
              {currentPath.title}
            </Text>
          </>
        ) : null}
      </Group>
      {currentPath.path !== 'completed' && (
        <Group gap="md" align="center">
          {currenctActive > 0 ? (
            <>
              <ActionIcon
                variant="filled"
                color="black"
                radius="lg"
                size="lg"
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
                  radius="lg"
                  size="lg"
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
              size="compact-md"
              rightSection={<IconArrowRight />}
              onClick={nextStep}
            >
              Bestil tid
            </Button>
          )}
        </Group>
      )}
    </Group>
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

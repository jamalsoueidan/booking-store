import {useField, useInputControl} from '@conform-to/react';
import {Combobox, Loader, rem, TextInput, useCombobox} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {IconCheck} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {type ApiAutoCompleteProposal} from '~/routes/api.address-autocomplete';

export type AddressAutocompleteInputProps = {
  label: string;
  name: string;
};

export function AddressAutocompleteInput({
  label,
  name,
}: AddressAutocompleteInputProps) {
  const [field] = useField<string>(name);
  const input = useInputControl(field);
  const combobox = useCombobox({
    onDropdownClose: () => {
      setTimeout(() => {
        input.blur();
      }, 50);
    },
    onDropdownOpen: () => {
      setTimeout(() => {
        input.focus();
      }, 50);
    },
  });
  const [value, setValue] = useState(field.initialValue ?? '');

  const fetcher = useFetcher<Array<ApiAutoCompleteProposal>>();
  const fetchOptions = (query: string) => {
    fetcher.load(`/api/address-autocomplete?q=${query}`);
  };

  const options = fetcher.data
    ?.map((item) => (
      <Combobox.Option value={item.tekst} key={item.tekst}>
        {item.tekst}
      </Combobox.Option>
    ))
    .slice(0, 5);

  const onOptionSubmit = (value: string) => {
    if (!fetcher.data) {
      return null;
    }

    const address: ApiAutoCompleteProposal | undefined = fetcher.data.find(
      (v) => v.tekst === value,
    );

    if (address?.type === 'adresse') {
      input.change(value);
      setValue(address.tekst);
      combobox.closeDropdown();
    } else {
      fetchOptions(value);
    }
  };

  const showDropdown = () => {
    if (fetcher.data && fetcher.data.length > 0) {
      combobox.openDropdown();
    }
  };

  const rightSection = useMemo(() => {
    if (fetcher.state !== 'idle') {
      return <Loader size="xs" />;
    }

    if ((field.value && !field.errors) || field.errors?.length === 0) {
      return (
        <IconCheck
          style={{width: rem(20), height: rem(20)}}
          color="var(--mantine-color-green-filled)"
          data-testid="username-success"
        />
      );
    }
  }, [fetcher.state, field.errors, field.value]);

  return (
    <>
      <input name={field.name} value={input.value} type="hidden" />
      <Combobox
        onOptionSubmit={onOptionSubmit}
        withinPortal={false}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            placeholder="Sigridsvej 45, 8220 Brabrand"
            label={label}
            value={value}
            onChange={(event) => {
              input.change(undefined);
              setValue(event.currentTarget.value);
              fetchOptions(event.currentTarget.value);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={showDropdown}
            onFocus={showDropdown}
            onBlur={() => {
              combobox.closeDropdown();
            }}
            error={field.errors && field.errors[0]}
            rightSection={rightSection}
          />
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>
            {!options ? (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            ) : (
              options
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}

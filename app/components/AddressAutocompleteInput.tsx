import {type conform} from '@conform-to/react';
import {Combobox, TextInput, useCombobox} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {type ApiAutoCompleteProposal} from '~/routes/($locale).api.autocomplete';

export type AddressAutocompleteInputProps = {
  label: string;
  placeholder: string;
  error?: string;
} & ReturnType<typeof conform.input>;

export function AddressAutocompleteInput({
  label,
  placeholder,
  defaultValue,
  error,
  ...config
}: AddressAutocompleteInputProps) {
  const fetcher = useFetcher<Array<ApiAutoCompleteProposal>>();
  const [query, setQuery] = useState({
    q: '',
    type: 'adresse',
    caretpos: 2,
    supplerendebynavn: true,
    stormodtagerpostnumre: true,
    multilinje: false,
    fuzzy: '',
    adgangsadresseid: null,
    startFra: null,
  });

  const combobox = useCombobox();
  const [value, setValue] = useState(defaultValue ?? '');

  useEffect(() => {
    if (query.q !== '' && query.q.length > 1) {
      fetcher.load(`/api/autocomplete?${objectToQueryString(query)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const options = fetcher.data?.map((item) => (
    <Combobox.Option value={item.forslagstekst} key={item.forslagstekst}>
      {item.forslagstekst}
    </Combobox.Option>
  ));

  const onOptionSubmit = (value: string) => {
    const address: ApiAutoCompleteProposal | undefined = fetcher.data?.find(
      (v) => v.forslagstekst === value,
    );

    if (!address) {
      return;
    }

    if ((address.data as any).adgangsadresseid !== undefined) {
      combobox.closeDropdown();
      return setValue(address.tekst);
    }

    if (
      fetcher.data &&
      fetcher.data.length === 1 &&
      address.type !== 'vejnavn'
    ) {
      combobox.closeDropdown();
      return setValue(address.tekst);
    } else {
      setQuery((prev) => ({
        ...prev,
        q: address.tekst,
        caretpos: address.caretpos,
        startfra: address.type === 'vejnavn' ? 'adgangsadresse' : null,
      }));
    }
  };

  const showDropdown = () => {
    if (fetcher.data && fetcher.data.length > 0) {
      combobox.openDropdown();
    }
  };

  return (
    <Combobox
      onOptionSubmit={onOptionSubmit}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          label={label} // Hvor vil du kører fra? Hvor skal kunden køre til?
          value={value}
          placeholder={placeholder}
          error={error}
          {...config}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setQuery({...query, q: event.currentTarget.value});
            if (event.currentTarget.value.length === 0) {
              return combobox.closeDropdown();
            }
            combobox.openDropdown();
          }}
          onClick={showDropdown}
          onFocus={showDropdown}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {!options ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

const objectToQueryString = (obj: any) => {
  return Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
};

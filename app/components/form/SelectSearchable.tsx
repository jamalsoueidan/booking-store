import {
  getInputProps,
  useInputControl,
  type FieldMetadata,
} from '@conform-to/react';
import {
  Combobox,
  Highlight,
  Loader,
  TextInput,
  useCombobox,
} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {type SerializeFrom} from '@remix-run/server-runtime';
import {parseGid} from '@shopify/hydrogen';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {loader as accountApiProductsLoader} from '~/routes/account.api.products';

export type SelectSearchableProps = {
  onChange?: (value: string | undefined) => void;
  label: string;
  placeholder?: string;
  field: FieldMetadata<string>;
  collectionTitle?: string | null;
  disabled: boolean;
};

export function SelectSearchable({
  onChange,
  label,
  placeholder,
  field,
  disabled,
  collectionTitle,
}: SelectSearchableProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const customInputRef = useRef<HTMLInputElement>(null);
  const control = useInputControl(field);

  const fetcher =
    useFetcher<Awaited<SerializeFrom<typeof accountApiProductsLoader>>>();
  const [title, setTitle] = useState('');

  const fetchOptions = useCallback(
    (keyword: string) => {
      fetcher.load(
        `/account/api/products?limit=10&keyword=${keyword}&excludeCreated=true&collection=${collectionTitle}`,
      );
    },
    [collectionTitle, fetcher],
  );

  useEffect(() => {
    if (!disabled && collectionTitle) {
      fetchOptions('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionTitle, disabled]);

  const options = fetcher.data?.products.nodes.map((item) => (
    <Combobox.Option value={parseGid(item.id).id} key={item.id}>
      <Highlight
        highlight={parseGid(item.id).id === field.value ? item.title : ''}
        size="sm"
      >
        {item.title}
      </Highlight>
    </Combobox.Option>
  ));

  return (
    <>
      <input
        {...getInputProps(field, {type: 'text'})}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        onFocus={() => customInputRef.current?.focus()}
        className="hidden-input"
      />

      <Combobox
        onOptionSubmit={(optionValue) => {
          const node = fetcher.data?.products.nodes.find(
            (item) => parseGid(item.id).id === optionValue,
          );
          if (node?.title) {
            setTitle(node?.title);
          }
          control.change(optionValue);
          combobox.closeDropdown();
        }}
        withinPortal={false}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            ref={customInputRef}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value);
              fetchOptions(event.currentTarget.value);
              control.change('');
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => {
              combobox.openDropdown();
            }}
            onFocus={() => {
              control.focus();
              combobox.openDropdown();
              if (!fetcher.data) {
                fetchOptions(title);
              }
            }}
            onBlur={() => {
              combobox.closeDropdown();
              control.blur();
            }}
            rightSection={fetcher.state === 'loading' && <Loader size={18} />}
          />
        </Combobox.Target>

        <Combobox.Dropdown hidden={fetcher.data === null}>
          <Combobox.Options>
            {options}
            {(!fetcher.data || fetcher.data?.products.nodes.length === 0) && (
              <Combobox.Empty>Ingen produkt med dette navn</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}

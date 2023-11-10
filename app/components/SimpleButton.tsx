export function SimpleButton({children, ...rest}: any) {
  return (
    <button
      {...rest}
      className="mantine-focus-auto mantine-active m-77c9d27d mantine-Button-root m-87cf2631 mantine-UnstyledButton-root"
    >
      {children}
    </button>
  );
}

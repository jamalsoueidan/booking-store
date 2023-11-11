export function SimpleButton({children, ...rest}: any) {
  return (
    <button
      {...rest}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="mantine-Button-root mantine-UnstyledButton-root mantine-Button-label"
    >
      {children}
    </button>
  );
}

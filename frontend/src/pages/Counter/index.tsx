import { ModeToggle } from "@/components/mode-toggle";
import { useAppStore } from "@/store/useAppSore";

export const Counter = () => {
  const { count, increase, decrease } = useAppStore();

  return (
    <>
      <ModeToggle />
      <div className="">
        <h1>Count: {count}</h1>
        <button onClick={increase}>➕</button>
        <button onClick={decrease}>➖</button>
      </div>
    </>
  );
};

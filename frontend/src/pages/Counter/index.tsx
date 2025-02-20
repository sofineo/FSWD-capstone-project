import { useAppStore } from "@/store/UseAppSore";
import { Button } from "@/components/ui/button";


export const Counter = () => {
  const { count, increase, decrease } = useAppStore();

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increase}>➕</button>
      <button onClick={decrease}>➖</button>
    </div>
  );
};


const MyComponent = () => {
  return <Button variant="default">Click Me</Button>;
};

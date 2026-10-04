import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
  id?: string;
  children: React.ReactNode;
};

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  className,
  id,
  children,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        className={className}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

"use client";
import {
  AvatarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  Heading,
  Flex,
  TextField,
  Button,
  TextArea,
} from "@radix-ui/themes";

import { useForm, Controller } from "react-hook-form";

function SignInForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log("La data es: ", data);
    console.log("La el tipo de dato de data es: ", typeof(data));
  });

  return (
    <Card className="w-full">
      <Heading size="6" className="mb-4 text-center p-4">
        Sign In
      </Heading>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2" className="p-4">
          <label htmlFor="user">Usuario</label>
          <Controller
            name="user"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo usuario es obligatorio",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="user"
                  type="text"
                  placeholder="your username"
                  autoFocus={true}
                  defaultValue=""
                  {...field}
                >
                  <TextField.Slot>
                    <AvatarIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          />

          <label htmlFor="email">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: "El campo email es obligatorio",
              },
            }}
            render={({ field }) => {
              return (
                <TextField.Root
                  id="email"
                  type="email"
                  placeholder="yourname@yourmail.com"
                  defaultValue=""
                  autoFocus={false}
                    {...field}
                >
                  <TextField.Slot>
                    <EnvelopeClosedIcon height={16} width={16} />
                  </TextField.Slot>
                </TextField.Root>
              );
            }}
          />

          <label htmlFor="password">Password</label>
          <TextField.Root
            id="password"
            type="password"
            placeholder="********"
            autoFocus={false}
          >
            <TextField.Slot>
              <LockClosedIcon height={16} width={16} />
            </TextField.Slot>
          </TextField.Root>

          <TextArea resize="vertical" placeholder="Your message..." />

          <Flex
            direction="row"
            gap="4"
            justify="between"
            className="my-4 w-full"
          >
            <Flex direction="column" className="my-4 w-1/3">
              <Button type="submit" className="w-100%">
                Sign In1
              </Button>
            </Flex>
            <Flex direction="column" className="my-4 w-1/3">
              <Button className="w-100%">Sign In2</Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}

export default SignInForm;

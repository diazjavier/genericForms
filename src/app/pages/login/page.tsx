import { Container, Text, Link, Flex } from "@radix-ui/themes";
import SignInForm from "@/components/auth/SignInForm";
import NavLink from "next/link";

function LoginPage() {
  return (
    <>
      <div className="flex h-screen w-full justify-center items-center m-2">
        <Flex direction="column" gap="2" className="w-full md:w-1/3 items-center">
          <SignInForm />
          <Container size="1" className="w-full">
            <Flex justify="between" className="w-full p-4 text-sm">
              <Text>No tiene una cuenta?</Text>
              <Link asChild>
                <NavLink href="/auth/register">Regístrese</NavLink>
              </Link>
            </Flex>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default LoginPage;

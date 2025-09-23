import { Container, Text, Link, Flex } from "@radix-ui/themes";
import NavLink from "next/link";
import GenericForm from "@/components/forms/GenericForm";
import { formUserRegiter } from "@/utils/forms/formUserRegister"

function Register() {

  return (
    <>
      <div className="flex h-screen w-auto justify-center items-center m-2">
        <Flex direction="column" gap="2" className="h-full w-full md:w-1/3 items-center">
          <GenericForm {...formUserRegiter}/>
          <Container size="1" className="w-full">
            <Flex justify="between" className="w-full p-4 text-sm">
              {/* <Text>No tiene una cuenta?</Text> */}
              <Link asChild>
                <NavLink href="/">Volver</NavLink>
              </Link>
            </Flex>
          </Container>
        </Flex>
      </div>
    </>
  );
}

export default Register;
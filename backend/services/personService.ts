import dataSource from "../utils/dbConfiguration";
import {} from "typeorm";

import { Person } from "../models/Person ";
import { PersonSaveDto } from "../dtos/person.dto";
import { User } from "../models/User";
class PersonService {
  private personRepo = dataSource.getRepository(Person);

  async savePerson(personDto: PersonSaveDto, user: User) {
    try {
      let person = new Person();

      person.firstName = personDto.firstName;
      person.lastName = personDto.lastName;
      person.phoneNumber = personDto.phoneNumber;
      person.postalCode = personDto.postalCode;
      person.addressLine = personDto.addressLine;
      person.user = user;
      console.log(user);
      this.personRepo.save(person);
    } catch (error) {
      console.log(error);
    }
  }
  async findPersonByUser(user: User): Promise<Person> {
    const person = this.personRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return person;
  }
}
export default new PersonService();

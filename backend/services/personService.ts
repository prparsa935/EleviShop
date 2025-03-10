import dataSource from "../utils/dbConfiguration.js";
import {} from "typeorm";

import { Person } from "../models/Person.js";
import { PersonSaveDto } from "../dtos/person.dto.js";
import { User } from "../models/User.js";
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

      this.personRepo.save(person);
    } catch (error) {
    
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

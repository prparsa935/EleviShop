import dataSource from "../utils/dbConfiguration.js";
import { Person } from "../models/Person.js";
class PersonService {
    constructor() {
        this.personRepo = dataSource.getRepository(Person);
    }
    async savePerson(personDto, user) {
        try {
            let person = new Person();
            person.firstName = personDto.firstName;
            person.lastName = personDto.lastName;
            person.phoneNumber = personDto.phoneNumber;
            person.postalCode = personDto.postalCode;
            person.addressLine = personDto.addressLine;
            person.user = user;
            this.personRepo.save(person);
        }
        catch (error) {
        }
    }
    async findPersonByUser(user) {
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

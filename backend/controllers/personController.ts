import { Request, Response } from "express";

import ResponseDTO from "../dtos/response.dto";

import { User } from "../models/User";
import { isNumberString, validate } from "class-validator";
import personService from "../services/personService";
import { plainToClass, plainToInstance } from "class-transformer";
import { PersonSaveDto } from "../dtos/person.dto";
import { Person } from "../models/Person ";

class PersonController {
  async savePerson(req: Request, res: Response) {
    try {
      let user: User = req["user"];
      const personDto = plainToInstance(PersonSaveDto, req.body);

      const errors = await validate(personDto);
      let fieldErrors = {};
      if (errors.length > 0) {
        errors.forEach((error) => {
          // this is a FieldValidationError
          fieldErrors[error.property] = error.constraints["matches"];
        });
        return res.status(400).json(new ResponseDTO(fieldErrors, null, false));
      }
      // const existingPerson = await personService.findPersonByUser(user);
      // if (existingPerson) {
      //   await personService.
      // } else {

      // }
      await personService.savePerson(personDto, user);

      return res
        .status(200)
        .json(new ResponseDTO({}, null, true, "پروفایل با موفقیت ثبت شد"));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
  async findPersonByUser(req: Request, res: Response) {
    try {
      const user: User = req["user"];
      const person = await personService.findPersonByUser(user);

      return res.status(200).json(person);
    } catch (error) {

      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
}
export default new PersonController();

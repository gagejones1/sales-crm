from pydantic import BaseModel, EmailStr

#------------------------------
#Customer schemas
#------------------------------
class CustomerCreate(BaseModel):
    name: EmailStr 
    email: str
    active: bool = True

class CustomerUpdate(BaseModel):
    name: EmailStr | None = None
    email: str | None = None
    active: bool | None = None

#------------------------------
#Company schemas
#------------------------------
class CompanyCreate(BaseModel):
    name: str
    industry: str | None = None
    website: str | None = None

class CompanyUpdate(BaseModel):
    name: str | None = None
    industry: str | None = None
    website: str | None = None


#------------------------------
#Contacts schema
#------------------------------
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    company_id: int

class ContactUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    company_id: int | None = None



#------------------------------
#Opportunities schema
#------------------------------
class OpportunityCreate(BaseModel):
    name: str
    value: int
    stage: str
    company_id: int

class OpportunityUpdate(BaseModel):
    name: str | None = None
    value: int | None = None
    stage: str | None = None
    company_id: int | None = None
package mmu.sef.fyj.dto;

public class AddressDTO {
    private String homeAddress;
    private String city;
    private String zipCode;
    private String state;

    public AddressDTO() {}

    public AddressDTO(String homeAddress, String city, String zipCode, String state) {
        this.homeAddress = homeAddress;
        this.city = city;
        this.zipCode = zipCode;
        this.state = state;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}

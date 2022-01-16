import { Button, Tooltip } from "antd";
import ResPlaces from "../interfaces/IResPlace";
import PlaceCategory from './PlaceCategory';

export default class Place {
    private id: number;
    private row: number;
    private number: number;
    private state: string;
    private sessionCost: number;
    private placeCategory: PlaceCategory;
    private showModal: () => void;

    public constructor(
        sessionCost: number,
        place: ResPlaces,
        placeCategory: PlaceCategory,
        showModal: () => void,
    ) {
        this.id = place.id;
        this.row = place.row;
        this.number = place.number;
        this.state = "free";
        this.sessionCost = sessionCost;
        this.placeCategory = placeCategory;
        this.showModal = showModal;
    }

    public setState(state: string) {
        this.state = state;
    }

    public getState() {
        return this.state;
    }

    public getId() {
        return this.id;
    }

    public getCost() {
        return this.sessionCost * this.placeCategory.getCoefficent();
    }

    public getContent() {
        return (
            <Tooltip title={this.state !== "busy" ? `${this.placeCategory.getName()} ${this.getCost()}` : ""}>
                <Button
                    style={{
                        backgroundColor: this.placeCategory.getBGColor(this.state),
                        color: "black"
                    }}
                    disabled={this.state === "busy"}
                    danger={this.state === "busy"}
                    onClick={() => {
                        if (this.state === "free") {
                            this.state = "choosed"
                        } else {
                            this.state = "free"
                        }
                        this.showModal();
                    }}
                >
                    {this.number}
                </Button>
            </Tooltip>
        )
    }

}
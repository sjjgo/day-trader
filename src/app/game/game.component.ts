import { Component, OnInit, ApplicationRef } from "@angular/core";
import { UserService } from "../_services/UserService.service";
import { PusherService } from "../_services/PusherService.service";
import { GameService } from "../_services/GameService.service";
import { ParamsService } from "../_services/ParamsService.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
  providers: [GameService],
})
export class GameComponent implements OnInit {
  public tables = [];
  private TOTAL = 40;
  private cummulativeTotal = {};
  private hasError = true;
  public waiting = false;
  public members = [];
  public channel;
  public user;
  public disabled: boolean = true;
  public round = 0;
  public balance = this.TOTAL;
  public error1: string = "";
  public error2: string = "";
  public prev1 = 0;
  public prev2 = 0;
  public indInv = 0;
  public grpInv = 0;
  public timer1;
  public timer2;
  public first_box;
  public snd_box;
  public currentTable = 0;
  public checked = 0;

  constructor(
    private userService: UserService,
    private pusher: PusherService,
    private router: Router,
    private game: GameService,
    private params: ParamsService
  ) {}

  ngOnInit() {
    let that = this;
    this.user = this.userService.getUser();
    this.channel = this.pusher
      .getPusher()
      .subscribe("presence-" + this.user.channel_id);
    this.bindToGameOver();
    this.bindToPlayerUpdated();
    this.bindToRoundCompleted();
    this.channel.members.each(function (member) {
      that.members.push(member);
    });
  }
  /*
  Validation and error checking
  */

  /*
  Delays the Keyup event.
  */

  public validateWithDelay(value, box, ms) {
    if (box == 1) {
      clearTimeout(this.timer1);
      let that = this;
      this.timer1 = setTimeout(function () {
        that.validate(value, box);
      }, ms);
    } else {
      clearTimeout(this.timer2);
      let that = this;
      this.timer2 = setTimeout(function () {
        that.validate(value, box);
      }, ms);
    }
  }

  public go(ind_invstmnt, grp_invstmnt) {
    // console.log("Should ask the user if they want to lock in their answer");
    this.game
      .saveResults(
        this.user.id,
        Number(ind_invstmnt),
        Number(grp_invstmnt),
        this.user.channel_id,
        this.round
      )
      .subscribe(
        (valid) => console.log("successs"),
        (error) => console.log("failed")
      );
    this.waiting = true;
  }

  public validate(value: string, box: number) {
    var result = this.validateValue(value, box);
    switch (box) {
      case 1:
        this.error1 = result.res;
        break;
      case 2:
        this.error2 = result.res;
        break;
      default:
        this.error1 = "An error has occured. Please contact the organizer.";
        this.error2 = "An error has occured. Please contact the organizer";
        break;
    }

    if (result.valid) {
      if (box == 1) this.prev1 = result.number;
      else this.prev2 = result.number;
    }

    if (this.hasError || this.balance != 0) this.disabled = true;
    else this.disabled = false;
  }

  private validateValue(value: string, box) {
    let result = { valid: false, res: "", number };
    var number = Number(value);
    this.hasError = true;
    console.log(number);
    if (isNaN(number)) result.res = "Not a number";
    else if (this.isNotALegitNumber(value)) result.res = "Not a number";
    else if (this.isNegative(number)) result.res = "Cannot be less than zero";
    else if (this.moreThanForty(number))
      result.res = "Cannot be more than " + this.TOTAL;
    else if (this.negativeCurrentBalance(number, box))
      result.res = "Current balance cannot be less than 0";
    else {
      result.valid = true;
      this.hasError = false;
      result.number = number;
    }

    return result;
  }
  /*
  Validations
   */
  private isNegative(value): boolean {
    if (value < 0) return true;
    return false;
  }

  private moreThanForty(value): boolean {
    if (value > this.TOTAL) return true;
    return false;
  }

  private negativeCurrentBalance(value, box): boolean {
    var currentBalance;
    if (box == 1) {
      currentBalance = this.balance + this.prev1 - value;
      if (currentBalance < 0) return true;
      else this.balance = currentBalance;
    } else if (box == 2) {
      currentBalance = this.balance + this.prev2 - value;
      if (currentBalance < 0) return true;
      else this.balance = currentBalance;
    }
    return false;
  }

  private isNotALegitNumber(value) {
    if ((value[0] == 0 && value.length > 1) || value[0] == " ") return true;
    return false;
  }

  /*
  Pusher event binding
   */
  private bindToRoundCompleted() {
    let that = this;
    this.channel.bind("round-completed", function (data) {
      console.log("round completed");
      console.log(data);
      for (let i = 0; i < that.members.length; i++) {
        that.members[i].info.grp_payoff = data.total_grp_investment;
        that.members[i].info.profit =
          that.members[i].info.grp_payoff +
          that.members[i].info.ind_payoff -
          (that.members[i].info.grp + that.members[i].info.ind);
        if (that.round != 0) {
          that.cummulativeTotal[that.members[i].id] +=
            that.members[i].info.profit;
        } else {
          that.cummulativeTotal[that.members[i].id] =
            that.members[i].info.profit;
        }
        that.members[i].info.total = that.cummulativeTotal[that.members[i].id];
      }
      let clonedMembers = JSON.stringify(that.members);
      that.tables.push(JSON.parse(clonedMembers));
      that.reset();
      that.currentTable = that.round;
      if (that.round != 4) {
        that.round++;
      }
    });
  }

  private bindToPlayerUpdated() {
    let that = this;
    this.channel.bind("player-updated", function (data) {
      console.log(data);
      for (var i = 0; i < that.members.length; i++) {
        if (that.members[i].id == data.user_id) {
          that.members[i]["info"]["ind"] = Number(data.ind);
          that.members[i]["info"]["grp"] = Number(data.grp);
          that.members[i]["info"]["ind_payoff"] = data.ind * 2;
          break;
        }
      }
      // console.log('player updated');
    });
  }

  private bindToGameOver() {
    let that = this;
    this.channel.bind("game-over", function (data) {
      setTimeout(function () {
        that.params.saveTables(that.tables);
        that.router.navigateByUrl("/end");
      }, 500);
    });
  }

  public switchTable(i) {
    // On click gets executed twice
    // but no bugs for now..
    this.currentTable = i;
  }

  public reset() {
    this.first_box = null;
    this.snd_box = null;
    this.balance = this.TOTAL;
    this.prev1 = 0;
    this.prev2 = 0;
    this.disabled = true;
    this.hasError = true;
    this.error1 = "";
    this.error2 = "";
    this.waiting = false;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionChannel = exports.Status = void 0;
var SubscriptionChannel;
(function (SubscriptionChannel) {
    SubscriptionChannel["sms"] = "sms";
    SubscriptionChannel["whatsapp"] = "whatsapp";
    // Add other channels as needed
})(SubscriptionChannel || (exports.SubscriptionChannel = SubscriptionChannel = {}));
var Status;
(function (Status) {
    Status["Pending"] = "pending";
    Status["Completed"] = "completed";
    // Add other statuses as needed
})(Status || (exports.Status = Status = {}));

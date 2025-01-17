/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Sheet } from "react-modal-sheet";
import toast, { Toaster } from "react-hot-toast";
import "../App.css";
import { dollarCoin, specials } from "../images";
import BottomTab from "../components/BottomTab";
import usePlayer from "../_hooks/usePlayer";
import Points from "../components/Points";
import Header from "../components/Header";
import Lock from "../icons/Lock";
import { usePlayerStore } from "../store/player";
import {
  calculateTimeLeft,
  calculateTimeLeftUsingTimestamp,
  numberWithCommas,
} from "../lib/utils";

const MinePage: React.FC = () => {
  type Card = {
    id: number;
    name: string;
    description: string;
    image: string | undefined;
    level: number;
    category_id: number;
    profit_per_hour: number;
    is_published: boolean;
    published_at_unix: number;
    upgrade: {
      available_at: number;
      available_until: number;
      is_limited: boolean;
      level: number;
      price: number;
      profit_per_hour: number;
      profit_per_hour_delta: number;
      is_available: boolean;
      condition: { id: number; level: number; name: string } | null;
    };
  };

  // const { token } = useAuthStore();
  // const [cards, setCards] = useState<ICard[]>([]);
  const {
    queryCards: { data: cardsData },
    queryDailyCombo: { data: dailyComboData },
    mutationCardUpgrade: { mutate },
    mutationDailyCombo: { mutate: mutateDailyCombo },
  } = usePlayer();
  const {
    dailyCombo,
    removeValue,
    resetDailyCombo,
    comboSubmitted,
    setComboSubmitted,
    dailyComboReward,
    dailyComboRewardModal,
    setDailyComboRewardModal,
  } = usePlayerStore();
  console.log("dailyComboRewardModal", dailyComboRewardModal);
  // console.log("dailyCombo", dailyCombo);
  // console.log("cardsData", cardsData);
  const { cards = [], categories = [] } = cardsData || {};
  const specialTabs = [
    { label: "My Cards", value: "mycards" },
    { label: "New Cards", value: "newcards" },
    { label: "Expired", value: "expired" },
  ];
  const [specialTab, setSpecialTab] = useState<
    "mycards" | "newcards" | "expired"
  >("mycards");
  // console.log("cards", cards);
  // console.log("categories", categories);
  // console.log('data', data)
  // const { data: cardsData } = data || {};
  // console.log("cardsData", cardsData);
  // const { cards, categories } = cardsData;
  // console.log("cards", cards);
  // console.log("categories", categories);
  // const [cardCategories, setCardCategories] = useState<string[]>([]);
  // console.log("dailyComboData", dailyComboData);
  const [buyCardData, setBuyCardData] = useState<Card>({
    id: 0,
    name: "",
    description: "",
    image: "",
    level: 0,
    category_id: 0,
    profit_per_hour: 0,
    is_published: false,
    published_at_unix: 0,
    upgrade: {
      price: 0,
      is_limited: false,
      level: 0,
      profit_per_hour: 0,
      profit_per_hour_delta: 0,
      is_available: false,
      condition: null,
      available_at: 0,
      available_until: 0,
    },
  });

  const [mineTab, setMineTab] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // const [setDailyRewardTimeLeft] = useState("");
  // const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  // const [, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  // TODO: still buggy, automatically reset just when check button clicked
  useEffect(() => {
    // console.log('dailyComboData?.is_submitted', dailyComboData?.is_submitted)
    if (comboSubmitted && dailyComboData?.is_submitted === false) {
      console.log("reset daily combo triggered");
      resetDailyCombo();
      setComboSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      // setDailyRewardTimeLeft(calculateTimeLeft(0));
      // setDailyCipherTimeLeft(calculateTimeLeft(19, true));
      setDailyComboTimeLeft(calculateTimeLeft(17, true));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatCardsPriceInfo = (profit: number) => {
    if (profit >= 1000000000) return `${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `${(profit / 1000).toFixed(2)}K`;
    return `${Math.round(profit)}`;
  };

  const handleUpgradeCard = async (cardId: number) => {
    try {
      mutate({ card_id: cardId });
      setOpen(false);
    } catch ({ error }: any) {
      console.log("error", error);
    }
  };
  // console.log("open", open);
  const dailyComboCards = (index: number) => {
    if (dailyComboData?.is_submitted && dailyComboData?.combination) {
      return dailyComboData?.combination[index]?.image;
    } else if (dailyCombo[index] && cardsData?.cards?.length > 0) {
      return cardsData?.cards?.filter(
        (c: Card) => c.id === dailyCombo[index]
      )?.[0]?.image;
    } else return specials;
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-[#fff3b2] text-white h-screen font-bold flex flex-col max-w-xl">
        <Header />

        <div className="flex-grow mt-4 bg-[#451e0f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#fff3b2] rounded-t-[46px] h-max">
            {!dailyComboData?.is_submitted && (
              <>
                <div className="w-full text-xs text-right mt-6 mb-1 px-5">
                  {dailyComboTimeLeft}
                </div>
                <div className="flex px-4 w-full rounded-lg">
                  <div className="text-sm flex bg-[#451e0f] w-full rounded-lg p-2">
                    <p>Daily combo</p>
                    <div className="flex justify-end items-center flex-1 gap-2">
                      <img
                        src={dollarCoin}
                        alt="Daily Combo Reward"
                        className="w-4 h-4"
                      />
                      <p>
                        +
                        {numberWithCommas(
                          parseInt(dailyComboData?.bonus_coins)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div
              className={`px-4 ${
                dailyComboData?.is_submitted ? "mt-6" : "mt-2"
              } flex justify-between gap-2`}
            >
              <div className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative">
                {dailyCombo[0] && !dailyComboData?.is_submitted && (
                  <div
                    onClick={() => removeValue(dailyCombo[0])}
                    className="absolute right-0 top-0 bg-red-500 text-xs p-1 rounded-full h-6 w-6 flex justify-center "
                  >
                    x
                  </div>
                )}
                <img
                  src={dailyComboCards(0)}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
              <div className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative">
                {dailyCombo[1] && !dailyComboData?.is_submitted && (
                  <div
                    onClick={() => removeValue(dailyCombo[1])}
                    className="absolute right-0 top-0 bg-red-500 text-xs p-1 rounded-full h-6 w-6 flex justify-center "
                  >
                    x
                  </div>
                )}
                <img
                  src={dailyComboCards(1)}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
              <div className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative">
                {dailyCombo[2] && !dailyComboData?.is_submitted && (
                  <div
                    onClick={() => removeValue(dailyCombo[2])}
                    className="absolute right-0 top-0 bg-red-500 text-xs p-1 rounded-full h-6 w-6 flex justify-center "
                  >
                    x
                  </div>
                )}
                <img
                  src={dailyComboCards(2)}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
              <div className="bg-[#451e0f] rounded-lg px-4 py-2 w-full relative">
                {dailyCombo[3] && !dailyComboData?.is_submitted && (
                  <div
                    onClick={() => removeValue(dailyCombo[3])}
                    className="absolute right-0 top-0 bg-red-500 text-xs p-1 rounded-full h-6 w-6 flex justify-center "
                  >
                    x
                  </div>
                )}
                <img
                  src={dailyComboCards(3)}
                  alt="Daily Combo"
                  className="mx-auto w-12 h-12"
                />
              </div>
            </div>
            {dailyCombo.every((i: number) => i !== null) &&
              !dailyComboData?.is_submitted && (
                <div className="mt-2 w-full flex justify-center">
                  <button
                    onClick={() => {
                      mutateDailyCombo({ combo: dailyCombo });
                    }}
                    className="bg-orange-500 px-2 py-1 rounded-md"
                  >
                    Submit Combo
                  </button>
                </div>
              )}

            <Points />

            <div className="max-w-xl bg-[#451e0f] flex justify-around items-center z-50 rounded-3xl text-xs">
              {categories?.length > 0 ? (
                categories?.map((c: any, cIdx: number) => {
                  return (
                    <div
                      className={`text-center text-white w-1/5 ${
                        mineTab === cIdx && "bg-[#904728] m-1 p-2 rounded-2xl"
                      }`}
                      onClick={() => setMineTab(cIdx)}
                      key={c.name}
                    >
                      <p className="mt-1">{c.name}</p>
                    </div>
                  );
                })
              ) : (
                <div className="w-full m-1 p-4 rounded-2xl"></div>
              )}
            </div>
            {mineTab === 3 && (
              <div className="max-w-xl flex justify-start items-center z-50 mt-6 text-xs">
                {specialTabs?.map((s: any) => {
                  return (
                    <div
                      className={`text-center text-[#451e0f] w-1/5 ${
                        specialTab === s.value && "text-[#904728]"
                      }`}
                      onClick={() => setSpecialTab(s.value)}
                      key={s.value}
                    >
                      <p className="mt-1">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap flex-row mt-6 mb-20">
              {cards
                ?.filter((c: Card) => {
                  if (mineTab !== 3) {
                    return (
                      c.category_id === categories?.[mineTab]?.id &&
                      c.is_published
                    );
                  } else {
                    switch (specialTab) {
                      case "mycards":
                        return (
                          c.category_id === categories?.[mineTab]?.id &&
                          c.is_published &&
                          c.level > 0
                        );
                      case "newcards":
                        return (
                          c.category_id === categories?.[mineTab]?.id &&
                          c.is_published &&
                          c.level === 0
                        );
                      case "expired":
                        return (
                          c.category_id === categories?.[mineTab]?.id &&
                          c.is_published &&
                          c.upgrade?.available_until > Date.now()
                        );

                      default:
                        return (
                          c.category_id === categories?.[mineTab]?.id &&
                          c.is_published &&
                          c.level > 0
                        );
                    }
                  }
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((c: Card, cIdx: any) => {
                  return (
                    <div
                      key={`${categories[mineTab]?.name}-card-${cIdx}`}
                      className="w-1/2  rounded-xl p-1"
                      onClick={async () => {
                        if (c?.upgrade && c?.upgrade?.is_available) {
                          console.log("card upgrade modal opened", c);
                          setOpen(true);
                          setBuyCardData(c);
                        } else
                          toast.error("Card not upgradable", {
                            style: {
                              borderRadius: "10px",
                              background: "#333",
                              color: "#fff",
                            },
                          });
                      }}
                    >
                      <div className="flex flex-col bg-[#451e0f] rounded-2xl h-full">
                        {/* <div className="w-full h-full">
                          {dailyCipherTimeLeft}
                        </div> */}
                        <div className="flex flex-row items-center p-3 flex-1">
                          {!c?.upgrade?.is_available && (
                            <div className="w-12 h-12">
                              <div className="flex items-center justify-center rounded-xl bg-neutral-500/30 w-14 h-14">
                                <img
                                  src={c.image}
                                  className="absolute mx-auto w-10 h-10"
                                />
                                {c?.level !== 25 && (
                                  <Lock
                                    size={24}
                                    className="absolute text-[#43433b] bg-white/80 rounded-full "
                                    containerClassName="flex h-full justify-center items-center"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          {c?.upgrade?.is_available && (
                            <img src={c.image} className=" mx-auto w-12 h-12" />
                          )}
                          <div className="flex flex-col gap-1 ml-4">
                            <p className="text-xs font-normal flex-1">
                              {c.name}
                            </p>
                            <p className="text-xs text-neutral-400 font-thin">
                              Profit per hour
                            </p>
                            <div className="flex items-center space-x-1">
                              <img
                                src={dollarCoin}
                                alt="Dollar Coin"
                                className="w-3 h-3"
                              />
                              {c?.upgrade?.is_available && c?.level > 0 ? (
                                <p className="text-sm text-white">
                                  {formatCardsPriceInfo(c.profit_per_hour)}
                                </p>
                              ) : c?.upgrade?.is_available && c?.level === 0 ? (
                                <p className="text-sm text-neutral-500">
                                  +
                                  {formatCardsPriceInfo(
                                    c.upgrade?.profit_per_hour
                                  )}
                                </p>
                              ) : null}
                              {!c?.upgrade?.is_available && (
                                <p className="text-sm text-neutral-500">
                                  {c?.level !== 25 &&
                                    formatCardsPriceInfo(
                                      c.upgrade?.profit_per_hour_delta
                                    )}
                                </p>
                              )}
                              {c.level === 25 && (
                                <p className="text-sm text-white">
                                  {formatCardsPriceInfo(c.profit_per_hour)}
                                </p>
                              )}
                            </div>
                            {c.upgrade?.available_until && (
                              <div className="w-full text-yellow-500 text-left text-xs font-thin flex-1">
                                Available until :{" "}
                                {calculateTimeLeftUsingTimestamp(
                                  c.upgrade?.available_until * 1000
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row w-full items-center border-t-[0.5px] border-gray-500">
                          <p
                            className={`text-xs font-semibold p-4 border-r-[0.5px] border-gray-500 ${
                              c?.level > 0 ? "text-white" : "text-neutral-500"
                            }`}
                          >
                            {c.level === 25 ? "MAX" : `lvl ${c.level}`}
                          </p>
                          <div className="flex items-center space-x-1 flex-1 p-4">
                            {c.level === 25 && <p className="text-[10px]">You owned this card</p>}
                            {c.upgrade?.available_at && (
                              <div className="w-full text-center text-md font-bold flex-1">
                                {calculateTimeLeftUsingTimestamp(
                                  c.upgrade?.available_at * 1000
                                )}
                              </div>
                            )}
                            {!c.upgrade?.available_at &&
                              c.upgrade?.is_available && (
                                <img
                                  src={dollarCoin}
                                  alt="Dollar Coin"
                                  className="w-4 h-4"
                                />
                              )}
                            {!c.upgrade?.is_available &&
                              c?.upgrade?.is_limited && (
                                <div className="w-full text-center text-md text-neutral-500 font-bold flex-1">
                                  Expired
                                </div>
                              )}
                            <div className="text-md text-white">
                              {c.upgrade?.is_available && c?.upgrade?.price ? (
                                formatCardsPriceInfo(c?.upgrade?.price)
                              ) : c.upgrade?.is_available &&
                                c?.upgrade?.condition?.name &&
                                c?.upgrade?.condition?.level ? (
                                <span className="text-xs font-thin">
                                  <p className="font-semibold">
                                    {c?.upgrade?.condition?.name}
                                  </p>{" "}
                                  lvl {c?.upgrade?.condition?.level}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-60 h-60 p-4 rounded-full circle-outer"
                onClick={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div> */}
            <Sheet
              isOpen={open}
              snapPoints={[0.55]}
              initialSnap={0}
              disableDrag={false}
              onClose={() => setOpen(false)}
              style={{
                zIndex: open ? "9999999" : "-1",
                visibility: open ? "visible" : "hidden",
              }}
            >
              <Sheet.Container>
                <Sheet.Header className="bg-[#451e0f]">
                  <div className="w-full flex justify-end px-4">
                    <button
                      className="text-white text-lg font-bold"
                      onClick={() => setOpen(false)}
                    >
                      x
                    </button>
                  </div>
                </Sheet.Header>
                <Sheet.Content className="bg-[#451e0f] text-white overflow-scroll no-scrollbar">
                  {/* Your sheet content goes here */}
                  <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
                    <img
                      src={buyCardData.image}
                      className="mx-auto w-12 h-12"
                    />
                    <h1 className="text-lg font-bold">
                      {buyCardData?.name ?? "-"}
                    </h1>
                    <h2 className="text-sm text-center">
                      {buyCardData?.description ?? ""}
                    </h2>
                    <div className="flex flex-col justify-center gap-1 items-center">
                      <div className="flex items-center space-x-1">
                        <p className="text-xs font-thin">Profit per hour: </p>
                        <img
                          src={dollarCoin}
                          alt="Dollar Coin"
                          className="w-3 h-3"
                        />
                        <p className="text-xs text-white font-semibold">
                          +{" "}
                          {formatCardsPriceInfo(
                            buyCardData?.upgrade?.profit_per_hour_delta
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-md font-bold text-white">Price: </p>
                      <img
                        src={dollarCoin}
                        alt="Dollar Coin"
                        className="w-6 h-6"
                      />
                      <p className="text-md font-bold text-white">
                        {buyCardData?.upgrade?.price
                          ? formatCardsPriceInfo(buyCardData?.upgrade?.price)
                          : ""}
                      </p>
                    </div>
                    <button
                      className="flex-1 w-full bg-[#904728] rounded-lg px-4 py-2"
                      onClick={() => handleUpgradeCard(buyCardData.id)}
                    >
                      {" "}
                      Buy{" "}
                    </button>
                  </div>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => setOpen(false)} />
            </Sheet>
            <Sheet
              isOpen={dailyComboRewardModal}
              snapPoints={[0.55]}
              initialSnap={0}
              disableDrag={false}
              onClose={() => setDailyComboRewardModal(false)}
              style={{
                zIndex: dailyComboRewardModal ? "9999999" : "-1",
                visibility: dailyComboRewardModal ? "visible" : "hidden",
              }}
            >
              <Sheet.Container>
                <Sheet.Header className="bg-[#451e0f]">
                  <div className="w-full flex justify-end px-4">
                    <button
                      className="text-white text-lg font-bold"
                      onClick={() => setDailyComboRewardModal(false)}
                    >
                      x
                    </button>
                  </div>
                </Sheet.Header>
                <Sheet.Content className="bg-[#451e0f] text-white overflow-scroll no-scrollbar">
                  {/* Your sheet content goes here */}
                  <div className="flex p-4 flex-col w-full justify-center items-center gap-5">
                    <img src={dollarCoin} className="mx-auto w-20 h-20" />
                    <h1 className="text-2xl text-center font-bold mt-6">
                      {`You got ${
                        dailyComboReward?.correct_combo
                      } card correct, and ${numberWithCommas(
                        dailyComboReward?.bonus_coins
                      )} bonus point`}
                    </h1>
                    <div className="absolute bottom-4 w-full px-6 z-50">
                      <button
                        className="flex justify-center w-full bg-[#904728] rounded-lg px-6 py-4"
                        onClick={() => setDailyComboRewardModal(false)}
                      >
                        Better luck next time!
                      </button>
                    </div>
                  </div>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => setDailyComboRewardModal(false)} />
            </Sheet>
          </div>
        </div>
      </div>

      <BottomTab />
      <Toaster position="top-left" />
    </div>
  );
};

export default MinePage;

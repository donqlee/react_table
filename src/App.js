import React, { useState, useReducer, useMemo, useCallback } from "react";
import UserList from "./UserList";
import CreateUser from "./CreateUser";
import {
  TableContainer,
  Card,
  Table,
  TableBody,
  Box,
  TableRow,
  TableCell,
  TableHead,
  Button,
} from "@mui/material";

const initialState = {
  buildingId: 1,
  buildingName: "반포자이",
  period: "2022-12",
  maintenanceFeeDetail: {
    maintenanceFeeTotalAmount: 1000000,
    maintenanceFeeFixedAmount: 640000,
    maintenanceFeeFloatingAmount: 360000,
    householdFees: [
      {
        householdId: 1,
        householdHoName: "1000",
        householdFeeTotalAmount: 50001,
        householdFeeFixedAmount: 32002,
        householdFeeFloatingAmount: 18003,
        fixedItemFees: [
          {
            name: "일반 관리비",
            amount: 9004,
          },
          {
            name: "경비비",
            amount: 7005,
          },
          {
            name: "미화원 인건비",
            amount: 8006,
          },
          {
            name: "전산사용료",
            amount: 8007,
          },
        ],
        floatingItemFees: [
          {
            name: "소모품",
            amount: 9008,
          },
          {
            name: "공용 전기 요금",
            amount: 9009,
          },
        ],
      },
      {
        householdId: 2,
        householdHoName: "1001",
        householdFeeTotalAmount: 50010,
        householdFeeFixedAmount: 32020,
        householdFeeFloatingAmount: 18030,
        fixedItemFees: [
          {
            name: "일반 관리비",
            amount: 9040,
          },
          {
            name: "경비비",
            amount: 7050,
          },
          {
            name: "미화원 인건비",
            amount: 8060,
          },
          {
            name: "전산사용료",
            amount: 8070,
          },
        ],
        floatingItemFees: [
          {
            name: "소모품",
            amount: 9080,
          },
          {
            name: "공용 전기 요금",
            amount: 9090,
          },
        ],
      },
    ],
  },
  maintenanceFeeInfo: {
    fixedItems: [
      {
        name: "일반 관리비",
        divisionType: "UNIT",
        amount: 180000,
      },
      {
        name: "경비비",
        divisionType: "UNIT",
        amount: 140000,
      },
      {
        name: "미화원 인건비",
        divisionType: "UNIT",
        amount: 160000,
      },
      {
        name: "전산사용료",
        divisionType: "UNIT",
        amount: 160000,
      },
    ],
    floatigItems: [
      {
        name: "소모품",
        divisionType: "AREA",
        amount: 180000,
      },
      {
        name: "공용 전기 요금",
        divisionType: "AREA",
        amount: 180000,
      },
    ],
  },
  floatingItemSubtotal: [
    { name: "소모품", amount: 180088 },
    { name: "공용 전기 요금", amount: 180099 },
  ],
};

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,

        inputs: {
          ...state.inputs,
          [action.name]: action.value,
        },
      };
    case "CREATE_USER":
      return {
        inputs: initialState.inputs,
        users: state.users.concat(action.user),
      };
    case "TOGGLE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.id ? { ...user, active: !user.active } : user
        ),
      };
    case "REMOVE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.id),
      };
    case "UPDATE_SUBTOTAL":
      const subTotal = [];
      for (let i = 0; i < state.floatingItemSubtotal.length; i += 1) {
        let sum = 0;

        for (
          let j = 0;
          j < state.maintenanceFeeDetail.householdFees.length;
          j += 1
        ) {
          sum +=
            state.maintenanceFeeDetail.householdFees[j].floatingItemFees[i]
              .amount;
        }
        const tempObj = {
          name: state.floatingItemSubtotal[i].name,
          amount: sum,
        };
        subTotal.push(tempObj);
      }
      return {
        ...state,
        floatingItemSubtotal: subTotal,
      };
    case "ADD_NEWCOL":
      console.log(state);
      return {
        ...state,
        floatingItemSubtotal: [...state.floatingItemSubtotal, action.addHeader],
        maintenanceFeeDetail: {
          ...state.maintenanceFeeDetail,
          householdFees: state.maintenanceFeeDetail.householdFees.map(
            (row) => ({
              ...row,
              floatingItemFees: [...row.floatingItemFees, action.addRow],
            })
          ),
        },
      };
    case "EDIT_COL":
      return {
        ...state,
        maintenanceFeeDetail: {
          ...state.maintenanceFeeDetail,
          householdFees: state.maintenanceFeeDetail.householdFees.map(
            (row) => ({
              ...row,
              floatingItemFees: row.floatingItemFees.map((row) =>
                row.name === action.editName
                  ? { name: action.editName, amount: action.editAmount }
                  : row
              ),
            })
          ),
        },
      };
    case "DELETE_COL":
      return {
        ...state,
        floatingItemSubtotal: [...state.floatingItemSubtotal, action.addHeader],

        maintenanceFeeDetail: {
          ...state.maintenanceFeeDetail,
          householdFees: state.maintenanceFeeDetail.householdFees.map(
            (row) => ({
              ...row,
              floatingItemFees: row.floatingItemFees.filter(
                (row) => row.name === action.deleteName
              ),
            })
          ),
        },
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [addOn, setAddOn] = useState(false);
  const add = () => {
    const addHeader = { name: "수도비", amount: 9000 };
    const addRow = { name: "수도비", amount: 4500 };
    dispatch({
      type: "ADD_NEWCOL",
      addHeader,
      addRow,
    });
    setAddOn(!addOn);
  };
  const edit = () => {
    const editName = "소모품";
    const editAmount = 10000;
    dispatch({
      type: "EDIT_COL",
      editName,
      editAmount,
    });
    dispatch({
      type: "UPDATE_SUBTOTAL",
    });
  };
  const del = () => {
    const deleteName = "소모품";
    dispatch({
      type: "DELETE_COL",
      deleteName,
    });
  };

  return (
    <>
      <Card sx={{ m: 10 }}>
        <TableContainer sx={{ minWidth: 100, position: "relative" }}>
          <Table size={"small"}>
            <TableHead sx={{ position: "sticky", top: 0 }}>
              <TableRow sx={{ background: "grey" }}>
                <TableCell align="center" sx={{ minWidth: 110 }}>
                  세대정보
                </TableCell>

                {state &&
                  state.floatingItemSubtotal.map((row) => (
                    <TableCell
                      align="center"
                      sx={{ minWidth: 110 }}
                      key={row.name}
                    >
                      {row.name}
                    </TableCell>
                  ))}
                {addOn ? (
                  <TableCell align="center" sx={{ minWidth: 110 }}>
                    <div>
                      <div>변동비총액</div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div style={{ margin: 10 }}>이전</div>
                        <div style={{ margin: 10 }}>이후</div>
                      </div>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell align="center" sx={{ minWidth: 110 }}>
                    변동비 총액
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={[
                  {
                    "& .MuiTableCell-root:first-of-type": {
                      p: "16px 0px 16px 0px",
                    },
                    "& .MuiTableCell-root:last-of-type": {
                      p: "16px 0px 16px 0px",
                    },
                    borderBottom: "1px solid rgb(228,232,235, 0.5)",
                    "& .MuiTableCell-root": {
                      fontSize: 12,
                      p: "16px 0px 16px 0px",
                    },
                  },
                ]}
              >
                <TableCell align="center" sx={{ minWidth: 110 }}>
                  항목별 총액
                </TableCell>
                {state &&
                  state.floatingItemSubtotal.map((row) => (
                    <TableCell
                      align="center"
                      sx={{ minWidth: 110 }}
                      key={row.name}
                    >
                      {row.amount}
                    </TableCell>
                  ))}
                <TableCell align="center" sx={{ minWidth: 110 }}>
                  {state.floatingItemSubtotal.reduce(
                    (acc, cur) => acc + cur.amount,
                    0
                  )}
                </TableCell>
              </TableRow>
              {state &&
                state.maintenanceFeeDetail.householdFees.map((row) => (
                  <TableRow
                    key={row.householdId}
                    sx={[
                      {
                        "& .MuiTableCell-root:first-of-type": {
                          p: "16px 0px 16px 0px",
                        },
                        "& .MuiTableCell-root:last-of-type": {
                          p: "16px 0px 16px 0px",
                        },
                        borderBottom: "1px solid rgb(228,232,235, 0.5)",
                        "& .MuiTableCell-root": {
                          fontSize: 12,
                          p: "16px 0px 16px 0px",
                        },
                      },
                    ]}
                  >
                    <TableCell align="center">
                      {row?.householdHoName}호
                    </TableCell>
                    {row &&
                      row.floatingItemFees.map((result, index) => (
                        <TableCell align="center" key={result.name}>
                          {result.amount}
                        </TableCell>
                      ))}
                    {addOn ? (
                      <TableCell align="center" sx={{ minWidth: 110 }}>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <div style={{ margin: 10 }}>이전</div>
                            <div style={{ margin: 10 }}>이후</div>
                          </div>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell align="center">
                        {row.floatingItemFees.reduce(
                          (acc, cur) => acc + cur.amount,
                          0
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Button variant="contained" sx={{ m: 10 }} onClick={add}>
        추가
      </Button>
      <Button variant="contained" sx={{ m: 10 }} onClick={edit}>
        수정
      </Button>
      <Button variant="contained" sx={{ m: 10 }} onClick={del}>
        삭제
      </Button>
    </>
  );
}

export default App;

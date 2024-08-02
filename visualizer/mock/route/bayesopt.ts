import { rest } from "msw";

export const mockURL = (path: string) => {
  return `http://localhost:3000/api${path}`;
};

const errorMsg = {
  error: "error",
  msg: "field not valid",
  type: "value_error.invalid_type",
};

const experimentState = {
  VAE_model: "",
  plot_config: {
    minimum_count: 2,
    show_training_data: true,
    show_bo_contour: true,
  },
  optimization_params: {
    method_name: "qEI",
    target_column_name: "value2",
    query_budget: 3,
  },
  distribution_params: {
    xlim_start: -3.5,
    xlim_end: 3.5,
    ylim_start: -3.5,
    ylim_end: 3.5,
  },
  registered_values: {
    sequences: ["AAUG", "GGUC", "CCGA"],
    target_column_names: ["value", "value2"],
    target_values: [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
  },
  query_data: {
    sequences: ["AAUG", "GGUC", "CCGA"],
    coords_x_original: [1, 0, -1],
    coords_y_original: [1, 0, -1],
  },
  acquisition_data: {
    coords_x: [-3.5, -3.5, -3.5, 0, 0, 0, 3.5, 3.5, 3.5],
    coords_y: [-3.5, 0, 3.5, -3.5, 0, 3.5, -3.5, 0, 3.5],
    values: [1, 0, 1, 0, 1, 0, 1, 0, 1],
  },
};

export const bayesoptHandlers = [
  rest.post(mockURL("/bayesopt/run"), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        acquisition_data: {
          coords_x: [-3.5, -3.5, -3.5, 0, 0, 0, 3.5, 3.5, 3.5],
          coords_y: [-3.5, 0, 3.5, -3.5, 0, 3.5, -3.5, 0, 3.5],
          values: [3.5, 0, 3.5, 0, 3.5, 0, 3.5, 0, 3.5],
        },
        query_data: {
          coords_x: [-0.1, 0.0, 0.1],
          coords_y: [-0.1, 0.0, 0.1],
        },
      })
    );
  }),

  rest.get(mockURL("/bayesopt/items"), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          uuid: "7df9fae4-245a-4cf2-8252-abcb649507df",
          name: "RAPT1",
          last_modified: 1720137600,
        },
        {
          uuid: "9f9ad2e8-6b37-4677-8ad3-1f214c843baf",
          name: "RAPT3",
          last_modified: 1720137600,
        },
      ])
    );
  }),

  rest.get(mockURL("/bayesopt/items/:uuid"), (req, res, ctx) => {
    let uuid = req.params.uuid;
    let vae_name: string;

    if (uuid === "7df9fae4-245a-4cf2-8252-abcb649507df") {
      vae_name = "RAPT1";
    } else {
      vae_name = "RAPT3";
    }

    return res(
      ctx.status(200),
      ctx.json({
        ...experimentState,
        expriment_name: "Exp: " + vae_name,
        VAE_model: vae_name,
      })
    );
  }),

  rest.put(mockURL("/bayesopt/items/:uuid"), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),

  rest.patch(mockURL("/bayesopt/items/:uuid"), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),

  rest.delete(mockURL("/bayesopt/items/:uuid"), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),

  rest.post(mockURL("/bayesopt/experiments/submit"), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        uuid: "f57f8e2d-3ca2-45b5-8874-d27306db54c2",
      })
    );
  }),
];

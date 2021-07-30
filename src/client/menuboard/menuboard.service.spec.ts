import { Test, TestingModule } from "@nestjs/testing";
import { CategoryService } from "../../../src/console/category/category.service";
import { MenuService } from "../../../src/console/menu/menu.service";
import { OptionService } from "../../../src/console/option/option.service";
import { OptiongroupService } from "../../../src/console/optiongroup/optiongroup.service";
import { StoreService } from "../../../src/console/store/store.service";
import { Category } from "../../../src/entities/category/category.entity";
import { EnableTime } from "../../../src/entities/menu/enableTime.entity";
import { Menu } from "../../../src/entities/menu/menu.entity";
import { OptionGroup } from "../../../src/entities/option/optionGroup.entity";
import { Store } from "../../../src/entities/store/store.entity";
import { User } from "../../../src/entities/user/user.entity";
import { createMemoryDB } from "../../../src/utils/connections/create-memory-db";
import { Connection, getRepository, Repository } from "typeorm";
import { MenuboardService } from "./menuboard.service";
import { Option } from "../../../src/entities/option/option.entity";
import { NotFoundException } from "@nestjs/common";

describe("MenuboardService", () => {
  let menuboardService: MenuboardService;
  let connection: Connection;

  //store
  let storeRepository: Repository<Store>;
  let storeService: StoreService;

  const NAME = "NAME";
  const ADDRESS = "ADDRESS";
  const PHONE_NUMBER = "01012345667";
  const TABLES = 45;
  const USERID = null;

  const saveStore = async (): Promise<Store> => {
    const savedStore = new Store();
    savedStore.setName = NAME;
    savedStore.setAddress = ADDRESS;
    savedStore.setPhone_number = PHONE_NUMBER;
    savedStore.setTables = TABLES;
    savedStore.user = USERID;
    return await storeRepository.save(savedStore);
  };
  //category
  let categoryRepoditory: Repository<Category>;
  let categoryService: CategoryService;

  const CategoryName = "CategoryName";
  const CategoryDesc = "CategoryDes";
  const Role = "ETC";
  const State = "주문 가능";
  const Category_Storeid = 1;

  const ResMenu: Menu[] = [];

  const saveCategory = async (): Promise<Category> => {
    const savedCategory = new Category();

    savedCategory.setCategoryName = CategoryName;
    savedCategory.setCategoryDesc = CategoryDesc;
    savedCategory.menus = ResMenu;
    savedCategory.setCategoryState = "true";
    savedCategory.setCategoryRole = Role;
    savedCategory.setCategoryState = State;
    savedCategory.store = await getRepository(Store).findOne(1);
    savedCategory.menus = await getRepository(Menu).findByIds([1]);
    return await categoryRepoditory.save(savedCategory);
  };
  //menu
  let menuRepository: Repository<Menu>;
  let menuService: MenuService;

  const saveMenu = async (): Promise<Menu> => {
    const savedMenu = new Menu();
    savedMenu.setMenuName = "MenuName";
    savedMenu.setMenuPrice = 10000;
    savedMenu.setMenuDesc = "DESC";
    savedMenu.setMenuState = "STATE";
    savedMenu.optionGroups = await getRepository(OptionGroup).findByIds([1]);
    return await menuRepository.save(savedMenu);
  };

  // optiongroup
  let optionGroupRepository: Repository<OptionGroup>;
  let optionGroupService: OptiongroupService;

  const saveOptionGroup = async (): Promise<OptionGroup> => {
    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = "OptionGroupName";
    savedOptionGroup.setOptionGroupDesc = "OptionGroupDesc";
    savedOptionGroup.setOptionGroupState = "OptionGroupState";
    savedOptionGroup.option_id = await getRepository(Option).findByIds([1]);
    return await optionGroupRepository.save(savedOptionGroup);
  };

  // option
  let optionRepository: Repository<Option>;
  let optionService: OptionService;

  const saveOption = async (): Promise<Option> => {
    const savedOption = new Option();
    savedOption.setOptionName = "OptionName";
    savedOption.setOptionPrice = 10000;
    savedOption.setOptionState = "OptionState";
    return await optionRepository.save(savedOption);
  };

  beforeAll(async () => {
    connection = await createMemoryDB([
      Category,
      Menu,
      Store,
      User,
      EnableTime,
      OptionGroup,
      Option,
    ]);

    storeRepository = await connection.getRepository(Store);
    storeService = new StoreService(storeRepository);

    categoryRepoditory = await connection.getRepository(Category);
    categoryService = new CategoryService(categoryRepoditory);

    menuRepository = await connection.getRepository(Menu);
    menuService = new MenuService(menuRepository);

    optionGroupRepository = await connection.getRepository(OptionGroup);
    optionGroupService = new OptiongroupService(optionGroupRepository);

    optionRepository = await connection.getRepository(Option);
    optionService = new OptionService(optionRepository);

    menuboardService = new MenuboardService(
      categoryRepoditory,
      menuRepository,
      optionGroupRepository
    );
  });

  it("should get correct category, menu info", async () => {
    await saveStore();
    await saveMenu();
    await saveCategory();
    const storeId = Buffer.from(String(1), "binary").toString("base64");
    const response = await menuboardService.getCategoryAndMenuByStoreId(
      storeId
    );
    expect(response[0].name).toBe("CategoryName");
    expect(response[0].description).toBe("CategoryDes");
    expect(response[0].state).toBe("주문 가능");
    expect(response[0].role).toBe("ETC");
    expect(response[0].menus[0].getMenuName).toBe("MenuName");
    expect(response[0].menus[0].getMenuPrice).toBe(10000);
    expect(response[0].menus[0].getMenuDesc).toBe("DESC");
    expect(response[0].menus[0].getMenuState).toBe("STATE");
  });

  it("should throw NotFoundException if storeId is not exist", async () => {
    try {
      await menuboardService.getCategoryAndMenuByStoreId("WrongStoreId");
    } catch (exception) {
      expect(exception).toBeInstanceOf(NotFoundException);
    }
  });

  it("should get correct optiongroup, option info", async () => {
    const savedOption = new Option();
    savedOption.setOptionName = "OptionName";
    savedOption.setOptionPrice = 10000;
    savedOption.setOptionState = "OptionState";
    await optionRepository.save(savedOption);

    const savedOptionGroup = new OptionGroup();
    savedOptionGroup.setOptionGroupName = "OptionGroupName";
    savedOptionGroup.setOptionGroupDesc = "OptionGroupDesc";
    savedOptionGroup.setOptionGroupState = "OptionGroupState";
    savedOptionGroup.option_id = await getRepository(Option).findByIds([
      savedOption.getOptionId,
    ]);
    await optionGroupRepository.save(savedOptionGroup);

    const savedMenu = new Menu();
    savedMenu.setMenuName = "MenuName";
    savedMenu.setMenuPrice = 10000;
    savedMenu.setMenuDesc = "DESC";
    savedMenu.setMenuState = "STATE";
    savedMenu.optionGroups = await getRepository(OptionGroup).findByIds([1]);
    await menuRepository.save(savedMenu);

    const response = await menuboardService.getOptionGroupAndOptionBymenuId(
      savedMenu.getMenuId
    );
    expect(response[0].name).toBe("OptionGroupName");
    expect(response[0].description).toBe("OptionGroupDesc");
    expect(response[0].state).toBe("OptionGroupState");
    expect(response[0].option[0].getOptionId).toBe(1);
    expect(response[0].option[0].getOptionName).toBe("OptionName");
    expect(response[0].option[0].getOptionPrice).toBe(10000);
    expect(response[0].option[0].getOptionState).toBe("OptionState");
  });

  it("should throw NotFoundException if storeId is not exist", async () => {
    try {
      await menuboardService.getOptionGroupAndOptionBymenuId(10000);
    } catch (exception) {
      expect(exception).toBeInstanceOf(TypeError);
    }
  });
});
